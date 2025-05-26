import numpy as np
from scipy.stats import norm


def estimate_sigma_from_rank(rank):
    if rank <= 3000:
        return 3000
    elif rank <= 8000:
        return 4000
    elif rank <= 15000:
        return 5000
    elif rank <= 30000:
        return 6000
    else:
        return 7500


def estimate_prob_general(
    ranks, your_rank, weights=None, trend_weight=0.4, trend_ratio=1
):
    """
    通用录取概率预测函数，支持1~3年数据
    ranks: 按时间顺序的历年排名（最新在最后）
    your_rank: 你的排名
    weights: 加权平均权重（自动根据年份数给默认值）
    trend_weight: 趋势在预测值中的权重占比
    trend_ratio: 趋势比例权重因子
    """
    n = len(ranks)
    ranks = np.array(ranks)
    if n == 1:
        mu = ranks[0]
        sigma = estimate_sigma_from_rank(mu)
        probability = 1 - norm.cdf(your_rank, loc=mu, scale=sigma)
        return probability, mu, sigma, None, mu
    elif n == 2:
        if weights is None:
            weights = (0.3, 0.7)
        r2, r1 = ranks
        mu_weighted = np.dot(weights, ranks)
        trend = r1 - r2
        r_trend = r1 + trend * trend_ratio
        mu = (1 - trend_weight) * mu_weighted + trend_weight * r_trend
        sigma = max(np.std(ranks, ddof=1), 80)
        probability = 1 - norm.cdf(your_rank, loc=mu, scale=sigma)
        return probability, mu, sigma, r_trend, mu_weighted
    elif n == 3:
        if weights is None:
            weights = (0.15, 0.35, 0.5)
        r3, r2, r1 = ranks
        mu_weighted = np.dot(weights, ranks)
        trend1 = r2 - r3
        trend2 = r1 - r2
        weighted_trend = (trend1 + trend_ratio * trend2) / (1 + trend_ratio)
        r_trend = r1 + weighted_trend
        mu = (1 - trend_weight) * mu_weighted + trend_weight * r_trend
        sigma = max(np.std(ranks, ddof=1), 80)
        probability = 1 - norm.cdf(your_rank, loc=mu, scale=sigma)
        return probability, mu, sigma, r_trend, mu_weighted
    else:
        raise ValueError("仅支持1~3年数据")


# 示例用法
ranks = [2373]
your_rank = 1
p, mu, sigma, trend_pred, weighted_mu = estimate_prob_general(ranks, your_rank)
print(f"📈 趋势预测值 (trend_ratio=3): {trend_pred:.1f}")
print(f"✅ 你被录取的概率: {p*100:.2f}%")
