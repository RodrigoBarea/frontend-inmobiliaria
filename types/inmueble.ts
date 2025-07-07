export interface Inmueble {
  id: number;
  attributes: {
    precio: number;
    inmuebleName: string;
    Direccion: string;
    ciudad: string;
    slug: string;
    tipo: string;
    dormitorios?: number;
    banos?: number;
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
    imagenes?: {
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
