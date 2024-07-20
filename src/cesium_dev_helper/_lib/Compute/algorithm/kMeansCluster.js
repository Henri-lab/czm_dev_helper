//k-means 聚类算法实现，包括初始化聚类中心、分配实体到最近的聚类中心、重新计算聚类中心以及检查是否收敛。
function kMeansCluster(entities, k) {
    // 初始化聚类中心
    let centroids = initializeCentroids(entities, k);
    let clusters = [];
    let hasConverged = false;

    while (!hasConverged) {
        // 创建空的聚类组
        clusters = Array.from({ length: k }, () => []);

        // 将每个实体分配到最近的聚类中心
        entities.forEach(entity => {
            let closestCentroidIndex = 0;
            let minDistance = Number.MAX_VALUE;

            centroids.forEach((centroid, index) => {
                const distance = calculateDistance(entity, centroid);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCentroidIndex = index;
                }
            });

            clusters[closestCentroidIndex].push(entity);
        });

        // 计算新的聚类中心
        const newCentroids = centroids.map((centroid, index) => {
            const cluster = clusters[index];
            return calculateMeanPosition(cluster);
        });

        // 检查聚类中心是否收敛
        hasConverged = newCentroids.every((newCentroid, index) => {
            return calculateDistance(newCentroid, centroids[index]) < 0.001;
        });

        centroids = newCentroids;
    }

    return clusters;
}

function initializeCentroids(entities, k) {
    // 简单随机选择 k 个初始中心点
    const shuffled = entities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, k);
}

function calculateDistance(entity1, entity2) {
    const latDiff = entity1.latitude - entity2.latitude;
    const lonDiff = entity1.longitude - entity2.longitude;
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

function calculateMeanPosition(entities) {
    const mean = { latitude: 0, longitude: 0 };
    entities.forEach(entity => {
        mean.latitude += entity.latitude;
        mean.longitude += entity.longitude;
    });
    mean.latitude /= entities.length;
    mean.longitude /= entities.length;
    return mean;
}