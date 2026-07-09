# Creator Review Queue 671-2163 操作文档

## 目标

把 `NaukNauk创作者资产审查工作台_0629～0705活跃P90` 这张表的第 `671-2163` 条记录转成一个本地 HTML 人工评分队列。

每个 `uid` 的处理逻辑：

1. 先统计该用户主页里 `published` 状态的全部帖子数量。
2. 如果 published post 总量 `< 3`，不进入人工队列，直接把 `current_author_grade` 写为 `C`。
3. 如果 published post 总量 `>= 3`，按该用户所有 published posts 的浏览量降序取前 5 篇。
4. HTML 页面每次展示 1 个用户、最多 5 篇 post。每篇展示 `cover`、`video`、标题/文本摘要、浏览量。
5. 页面下方展示 `uid` 和 published post 数量，并提供 `S/A/B/C/D` 评级按钮。
6. 人工评完后导出新 CSV：保留原 CSV 全部字段，但更新 `current_author_grade`，并追加审查辅助字段。

## 行号口径

本任务中的 `671-2163` 指表格数据记录序号，不包含表头。

如果 CSV 第一行是 header，则：

- `record_index = csv_data_row_number`，从 1 开始。
- 第 671 条记录是 CSV 文件的第 672 行。
- 第 2163 条记录是 CSV 文件的第 2164 行。

生成脚本里必须显式写入：

```python
START_RECORD_INDEX = 671
END_RECORD_INDEX = 2163
```

并只处理 `START_RECORD_INDEX <= record_index <= END_RECORD_INDEX` 的行。

## 输入审查表真实字段

来自当前 Excel/CSV 的字段名如下，必须按原名读取和写回：

```text
备注
priority_tier
priority_score
priority_reason
user_id
user_name
creator_profile_url
country
current_author_grade
follower_count
total_likes
published_posts_total
valid_posts_week
active_publish_days_week
last_publish_time
c3_c4_count_week
c0_c1_count_week
total_feed_impression_week
pooled_wer_week
historical_c3_c4_count
historical_c0_c1_count
historical_best_post_like_count
best_post_id
best_post_title
best_post_content_level
best_post_feed_impression_7d
best_post_wer_7d
best_post_like_count_7d
父记录
```

关键输入字段：

- `user_id`: uid 主键。
- `user_name`: 页面展示名。
- `creator_profile_url`: 后台 creator profile 链接。
- `current_author_grade`: 需要被新评分覆盖的字段。
- `published_posts_total`: 原表已有的 published post 数量，可作为校验；最终以实时查询出来的 published count 为准。

## 数据源真实字段

帖子基础表：

```sql
naukro.nauk.post
```

需要字段：

- `id` -> `post_id`
- `user_id`
- `title`
- `content`
- `cover`
- `video_264`
- `processed_video_264`
- `processed_video`
- `original_video`
- `video_no_sound`
- `status`
- `visibility`
- `publish_at`

published 状态判断优先使用生命周期表：

```sql
dwd.post_lifecycle_df
```

需要字段：

- `dt`
- `post_id`
- `user_id`
- `post_status`
- `publish_status`
- `publish_at`
- `created_at`
- `content_level`
- `content_level_name`
- `pre_moderation_status`
- `first_review_status`
- `premoderation_result`
- `first_review_result`
- `review_status_name`
- `human_result`

浏览量表：

```sql
spectrum_schema.dws_post_action_summary_di_v2
```

需要字段：

- `dt`
- `post_id`
- `impression`
- `click`
- `"like"`
- `"comment"`
- `nauk`
- `share`
- `follow`
- `module`
- `source`

## Published Post 口径

用于判断 `<3` 的 published post 总量，不按内容质量过滤，不排除 C0/C1。

过滤条件：

```sql
pl.post_status = 1
AND COALESCE(pl.publish_status, '') IN ('published', 'clip_published')
```

为避免把已拒绝/不可见内容放进人工审查卡片，展示 top posts 时再加以下安全过滤：

```sql
AND COALESCE(pl.pre_moderation_status, 0) <> 3
AND COALESCE(pl.first_review_status, 0) <> 2
AND LOWER(COALESCE(pl.premoderation_result, '')) NOT LIKE '%reject%'
AND LOWER(COALESCE(pl.first_review_result, '')) NOT LIKE '%reject%'
AND LOWER(COALESCE(pl.review_status_name, '')) NOT LIKE '%reject%'
AND LOWER(COALESCE(pl.human_result, '')) NOT LIKE '%reject%'
```

如果产品口径明确“只看后台主页里可见的 published posts”，可以把上述安全过滤也加到 count 上；否则 count 只按 published 状态统计。

## 补数 SQL

Codex 应先从输入 CSV 取出 `671-2163` 的 `user_id`，写入临时 user list，然后查询这些 uid 的 published count 和 top posts。

推荐做法：在 Python 里把 uid 列表拼成 `VALUES` CTE。注意对 uid 做 SQL 字符串转义。

```sql
WITH input_users(user_id) AS (
    VALUES
        ('USERxxx'),
        ('USERyyy')
),
params AS (
    SELECT MAX(dt) AS snapshot_dt
    FROM dwd.post_lifecycle_df
),
published_posts AS (
    SELECT *
    FROM (
        SELECT
            pl.post_id,
            pl.user_id,
            pl.publish_at,
            pl.created_at,
            pl.content_level,
            pl.content_level_name,
            pl.pre_moderation_status,
            pl.first_review_status,
            pl.premoderation_result,
            pl.first_review_result,
            pl.review_status_name,
            pl.human_result,
            ROW_NUMBER() OVER (
                PARTITION BY pl.post_id
                ORDER BY pl.publish_at DESC NULLS LAST, pl.created_at DESC NULLS LAST
            ) AS rn
        FROM dwd.post_lifecycle_df pl
        JOIN params p
          ON pl.dt = p.snapshot_dt
        JOIN input_users iu
          ON iu.user_id = pl.user_id
        WHERE pl.post_status = 1
          AND COALESCE(pl.publish_status, '') IN ('published', 'clip_published')
    ) t
    WHERE rn = 1
),
published_count AS (
    SELECT
        user_id,
        COUNT(DISTINCT post_id) AS published_posts_count
    FROM published_posts
    GROUP BY 1
),
visible_posts AS (
    SELECT *
    FROM published_posts
    WHERE COALESCE(pre_moderation_status, 0) <> 3
      AND COALESCE(first_review_status, 0) <> 2
      AND LOWER(COALESCE(premoderation_result, '')) NOT LIKE '%reject%'
      AND LOWER(COALESCE(first_review_result, '')) NOT LIKE '%reject%'
      AND LOWER(COALESCE(review_status_name, '')) NOT LIKE '%reject%'
      AND LOWER(COALESCE(human_result, '')) NOT LIKE '%reject%'
),
post_impression AS (
    SELECT
        m.post_id,
        SUM(COALESCE(m.impression, 0)) AS impression_total
    FROM spectrum_schema.dws_post_action_summary_di_v2 m
    JOIN visible_posts vp
      ON vp.post_id = m.post_id
    GROUP BY 1
),
post_detail AS (
    SELECT
        vp.user_id,
        vp.post_id,
        p.title,
        p.content,
        p.cover AS cover_url,
        COALESCE(
            NULLIF(p.video_264, ''),
            NULLIF(p.processed_video_264, ''),
            NULLIF(p.processed_video, ''),
            NULLIF(p.original_video, ''),
            NULLIF(p.video_no_sound, '')
        ) AS video_url,
        vp.publish_at,
        COALESCE(vp.content_level_name, 'unknown') AS content_level_name,
        COALESCE(pi.impression_total, 0) AS impression_total,
        ROW_NUMBER() OVER (
            PARTITION BY vp.user_id
            ORDER BY COALESCE(pi.impression_total, 0) DESC,
                     vp.publish_at DESC NULLS LAST,
                     vp.post_id
        ) AS post_rank
    FROM visible_posts vp
    JOIN naukro.nauk.post p
      ON p.id = vp.post_id
    LEFT JOIN post_impression pi
      ON pi.post_id = vp.post_id
)
SELECT
    iu.user_id,
    COALESCE(pc.published_posts_count, 0) AS published_posts_count,
    pd.post_rank,
    pd.post_id,
    pd.title,
    pd.content,
    pd.cover_url,
    pd.video_url,
    pd.publish_at,
    pd.content_level_name,
    pd.impression_total
FROM input_users iu
LEFT JOIN published_count pc
  ON pc.user_id = iu.user_id
LEFT JOIN post_detail pd
  ON pd.user_id = iu.user_id
 AND pd.post_rank <= 5
ORDER BY iu.user_id, pd.post_rank;
```

## 生成中间 JSON

把查询结果和原 CSV 合并成 `review_queue_671_2163.json`，结构建议：

```json
[
  {
    "record_index": 671,
    "user_id": "USER...",
    "user_name": "...",
    "creator_profile_url": "https://admin.nauknauk.ai/admin/user/USER...",
    "original_current_author_grade": "C",
    "published_posts_count": 12,
    "auto_grade": null,
    "posts": [
      {
        "post_rank": 1,
        "post_id": "POST...",
        "title": "...",
        "content": "...",
        "cover_url": "https://...",
        "video_url": "https://...",
        "publish_at": "2026-07-05 ...",
        "content_level_name": "C3",
        "impression_total": 1234
      }
    ],
    "source_row": {
      "...": "原 CSV 整行字段"
    }
  }
]
```

规则：

- 如果 `published_posts_count < 3`，设置 `auto_grade = "C"`，并且这条不进入人工队列。
- 如果 `posts` 不足 5 篇，HTML 中补空卡片占位，不要伪造 post。
- 如果某个 post 没有 `video_url`，只展示 cover，并在视频区域显示 `No video`。
- 如果某个 post 没有 `cover_url`，用空白占位。

## HTML 队列要求

生成一个可本地打开或本地 server 运行的页面，例如：

```text
review_queue_671_2163.html
review_queue_671_2163.json
```

页面布局参考截图：

- 顶部：`Review Management`
- 中部：5 个 post 卡片横向排列，每张卡片：
  - title
  - video 标签，`controls`，`poster=cover_url`
  - cover 缩略图
  - content 摘要
  - `post_id`、`impression_total`、`content_level_name`
- 底部：
  - `user_name`
  - `uid`
  - `Published Posts: N`
  - `creator_profile_url` 可点击
  - 评级按钮：`S`、`A`、`B`、`C`、`D`
  - `Skip`、`Submit`、`Export CSV`

交互规则：

- 快捷键：`Q=S`、`W=A`、`E=B`、`R=C`、`T=D`。
- 点击评级后高亮当前选择。
- `Submit` 后保存到 `localStorage`，自动跳到下一位。
- `Skip` 不写 grade，只标记 skipped，并跳到下一位。
- 页面顶部显示进度：`reviewed / manual_queue_total`，以及 auto-C 数量。
- 刷新页面不丢结果，结果从 `localStorage` 恢复。
- `Export CSV` 导出完整结果。

## 导出 CSV 要求

输出文件名：

```text
NaukNauk_creator_review_671_2163_reviewed.csv
```

输出内容：

1. 包含原输入 CSV 所有字段。
2. 对 `record_index` 在 `671-2163` 的行更新 `current_author_grade`：
   - `published_posts_count < 3`：写 `C`
   - 人工提交过的：写人工选择的 `S/A/B/C/D`
   - skipped 或未评完：保留原 `current_author_grade`
3. 追加以下字段：

```text
record_index
original_current_author_grade
reviewed_current_author_grade
grade_source
published_posts_count_observed
top_post_ids_by_impression
reviewed_at
review_note
```

字段含义：

- `grade_source`: `auto_published_lt3`、`manual_html`、`skipped`、`unreviewed`。
- `published_posts_count_observed`: SQL 查询出来的 published post 数量。
- `top_post_ids_by_impression`: top 5 post_id，用 `|` 拼接。
- `reviewed_at`: 浏览器提交时间，ISO 字符串。
- `review_note`: 可选人工备注，没有就空。

## SABCD 标准摘要

硬规则优先：

- published post `< 3`：直接 C。
- D 只给需要打压/强负向账号，例如 AI+真人、AI+色情、邪典等；纯 AI 先放 C。

人工审 B 的重点：

- 作者有明显风格取向：审美方向一致，不要求同一个 figure 或同系列 figure。
- 有摄影 setup：背景服务内容，画面清晰。
- 有 storytelling 意识：内容是带意图创作的，不是随机上传。

等级：

- S：核心创作者资产，方向稳定、代表作强、完成度高、可成为平台标杆。
- A：高潜创作者资产，已有强创作能力，但稳定性/作品厚度/持续性未到 S。
- B：潜力创作者或可模板提升对象，有真实玩家感和内容雏形，但表达/结构/完成度仍不稳定。
- C：普通 UGC 或观察用户，有发布行为但暂未形成明确创作者资产价值。
- D：低优先级且强负向，需要打压或不适合进入运营池。

## Codex 执行清单

1. 读取输入 CSV，确认存在 `user_id`、`current_author_grade`、`creator_profile_url`。
2. 按数据记录序号筛选 `671-2163`。
3. 从筛选行提取唯一 `user_id`。
4. 用 Redshift 查询这些 uid 的 `published_posts_count` 和 top 5 posts。
5. 生成 `review_queue_671_2163.json`。
6. 生成 `review_queue_671_2163.html`。
7. 打开 HTML 做人工审阅；评完后点击 `Export CSV`。
8. 校验导出的 CSV：
   - 行数等于原 CSV 行数。
   - 原字段都存在。
   - `671-2163` 之外的 `current_author_grade` 不变。
   - `published_posts_count_observed < 3` 的目标行全部是 `C`。
   - `grade_source=manual_html` 的行都有 `reviewed_current_author_grade`。
