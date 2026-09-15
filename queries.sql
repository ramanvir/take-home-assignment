-- SQLite-compatible answers. Every statement in this file is read-only.
-- ISO dates are quoted strings because SQLite does not support DATE '...'.

-- Question 1: August starts with a budget strictly above 5000.
SELECT
    campaign_id,
    campaign_name
FROM Campaigns
WHERE start_date BETWEEN '2026-08-01' AND '2026-08-31'
  AND budget > 5000.00
ORDER BY budget DESC;

-- Question 2: Overall August CPC for each campaign and device.
SELECT
    campaign_id,
    device_type,
    COALESCE(
        1.0 * SUM(spend) / NULLIF(SUM(clicks), 0),
        0
    ) AS cpc
FROM AdMetrics
WHERE campaign_id IN ('CID-ABC111', 'CID-ABC222', 'CID-ABC333')
  AND report_date BETWEEN '2026-08-01' AND '2026-08-31'
GROUP BY
    campaign_id,
    device_type
ORDER BY campaign_id, device_type;

-- Question 3: All-time totals for requested advertisers and their campaigns.
SELECT
    a.advertiser_id,
    c.campaign_id,
    c.campaign_name,
    COALESCE(SUM(m.impressions), 0) AS total_impressions,
    COALESCE(SUM(m.clicks), 0) AS total_clicks,
    COALESCE(SUM(m.spend), 0) AS total_spend
FROM Advertisers AS a
LEFT JOIN Campaigns AS c
    ON c.advertiser_id = a.advertiser_id
LEFT JOIN AdMetrics AS m
    ON m.campaign_id = c.campaign_id
WHERE a.advertiser_id IN ('ADV-111', 'ADV-222', 'ADV-333')
GROUP BY
    a.advertiser_id,
    c.campaign_id,
    c.campaign_name
ORDER BY
    total_impressions DESC,
    total_spend DESC;
