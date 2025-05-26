// 正态分布的累积分布函数 CDF（近似实现）
function normalCDF(x, mean, std) {
    let z = (x - mean) / std;
    return 0.5 * (1 - erf(-z / Math.sqrt(2)));
}

// 误差函数 erf 的近似实现
function erf(x) {
    // Abramowitz and Stegun formula 7.1.26
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

// 样本标准差
function sampleStd(arr) {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / (arr.length - 1);
    return Math.sqrt(variance);
}

// 推测标准差（根据排名区间）
function estimateSigmaFromRank(rank) {
    if (rank <= 3000) return 3000;
    else if (rank <= 8000) return 4000;
    else if (rank <= 15000) return 5000;
    else if (rank <= 30000) return 6000;
    else return 7500;
}

// 主函数
function estimateProbGeneral(ranks, yourRank, weights = null, trendWeight = 0.4, trendRatio = 1) {
    // 除去ranks中的NaN值
    ranks = ranks.filter(rank => !isNaN(rank) && rank > 0).sort((a, b) => a - b);
    const n = ranks.length;

    if (n === 1) {
        const mu = ranks[0];
        const sigma = estimateSigmaFromRank(mu);
        const probability = 1 - normalCDF(yourRank, mu, sigma);
        return { probability, mu, sigma, r_trend: null, mu_weighted: mu };
    }

    if (n === 2) {
        if (!weights) weights = [0.3, 0.7];
        const [r2, r1] = ranks;
        const mu_weighted = weights[0] * r2 + weights[1] * r1;
        const trend = r1 - r2;
        const r_trend = r1 + trend * trendRatio;
        const mu = (1 - trendWeight) * mu_weighted + trendWeight * r_trend;
        const sigma = Math.max(sampleStd(ranks), 80);
        const probability = 1 - normalCDF(yourRank, mu, sigma);
        return { probability, mu, sigma, r_trend, mu_weighted };
    }

    if (n === 3) {
        if (!weights) weights = [0.15, 0.35, 0.5];
        const [r3, r2, r1] = ranks;
        const mu_weighted = weights[0] * r3 + weights[1] * r2 + weights[2] * r1;
        const trend1 = r2 - r3;
        const trend2 = r1 - r2;
        const weighted_trend = (trend1 + trendRatio * trend2) / (1 + trendRatio);
        const r_trend = r1 + weighted_trend;
        const mu = (1 - trendWeight) * mu_weighted + trendWeight * r_trend;
        const sigma = Math.max(sampleStd(ranks), 80);
        const probability = 1 - normalCDF(yourRank, mu, sigma);
        return { probability, mu, sigma, r_trend, mu_weighted };
    }

    throw new Error("仅支持1~3年数据");
}

const result = estimateProbGeneral([1465], 1);
console.log(result);
