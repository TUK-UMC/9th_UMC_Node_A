// Store DTO 변환 함수들

// 요청 body를 Store 엔티티로 변환
export const bodyToStore = (body) => {
    return {
        name: body.name,
        regionName: body.regionName || body.region_name,
        address: body.address,
        description: body.description || "",
        status: body.status || "active", // ✅ String으로 변경
    };
};

// Store 엔티티를 응답 DTO로 변환
export const storeToResponse = (store) => {
    return {
        storeId: store.storeId,
        name: store.name,
        regionName: store.regionName,
        address: store.address,
        description: store.description,
        status: store.status,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
    };
};
