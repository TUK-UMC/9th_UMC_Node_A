class storeDtos{
    bodyToStore(body) {
        return {
            region_id: body.region_id,
            storename: body.storename,
            address: body.address,
            score: body.score || "",
        };
    };

    responseFromStore(store) {
        return {
            region_id: store.region_id,
            storename: store.storename,
            address: store.address,
            score: store.score,
        }
    }
}

export default new storeDtos();