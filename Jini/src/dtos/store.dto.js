// Store DTO 변환 함수들

// 요청 body를 Store 엔티티로 변환
export const bodyToStore = (body) => {
    return {
        name: body.name,
        regionName: body.regionName || body.region_name,
        address: body.address,
        description: body.description || "",
        status: body.status !== undefined ? body.status : 1,
    };
};

// Store 엔티티를 응답 DTO로 변환
export const storeToResponse = (store) => {
    return {
        storeId: store.store_id,
        name: store.name,
        regionName: store.region_name,
        address: store.address,
        description: store.description,
        status: store.status,
        createdAt: store.created_at,
        updatedAt: store.updated_at,
    };
};
