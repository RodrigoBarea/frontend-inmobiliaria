export interface Inmueble {
  id: number;
  attributes: {
    precio: number;
    inmuebleName: string;
    Direccion: string;
    ciudad: string;
    slug: string;
    tipo: string;
    dormitorios: number;  // Cambiado de opcional a requerido
    banos: number;        // Cambiado de opcional a requerido
    terreno?: number;
    estacionamientos?: number;
    ubicacion: {
      center: [number, number];
    };
    categoria?: {
      data?: {
        attributes: {
          nombreCategoria: string;
        };
      };
    };
    imagenes: {  // Cambiado de opcional a requerido
      data: {
        attributes: {
          url: string;
          formats?: {
            large?: {
              url: string;
            };
          };
        };
      }[];
    };
  };
}
