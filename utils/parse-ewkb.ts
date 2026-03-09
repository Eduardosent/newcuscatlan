export const parseEWKB = (hex: string) => {
    if (!hex || typeof hex !== 'string') return null;
    
    // Convertimos el hex a buffer de bytes
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(b => parseInt(b, 16)));
    const view = new DataView(bytes.buffer);

    // En EWKB de PostGIS: Longitud byte 9, Latitud byte 17 (Little Endian)
    return {
        longitude: view.getFloat64(9, true),
        latitude: view.getFloat64(17, true)
    };
};