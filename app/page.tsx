import Asesoramiento from "@/components/asesoramiento";
import BannerPrincipal from "@/components/banner";

import Footer from "@/components/footer";
import GuiasInmobiliarias from "@/components/guiasinmobiliarias";
import InmueblesDestacados from "@/components/inmuebles-destacados";


export default function Home() {
  return (
    <main>
        <BannerPrincipal/>
        <InmueblesDestacados/>
        <Asesoramiento/>
        <GuiasInmobiliarias/>
        
        

    </main>
           
  );
}
