import { Metadata } from 'next';
import { PropertyDetailClient } from '@/components/app/properties/id/property-detail-client';
import { PropertyRepository } from "@/repositories";
import { APP_URL, R2_URL } from "@/config"; // <--- Importamos R2_URL

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const property = await PropertyRepository.getPropertyById(id);

    if (!property) {
      return { title: "Propiedad no encontrada | NewCuscatlan.com" };
    }

    const title = `${property.title} | NewCuscatlan.com`;
    const description = property.description?.substring(0, 160) || "Encuentra tu próximo hogar";

    // CONSTRUCCIÓN DE LA URL ABSOLUTA PARA R2
    // Si la imagen ya es una URL completa la dejamos pasar, 
    // si no, la concatenamos con la URL de tu bucket de Cloudflare R2.
    const rawImage = property.image_urls?.[0];
    const imageUrl = rawImage?.startsWith('http') 
      ? rawImage 
      : `${R2_URL}/${rawImage}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${APP_URL}/properties/${id}`,
        type: "website",
        images: [
          {
            url: imageUrl, // <--- Ahora sí apunta a Cloudflare R2
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error cargando metadata:", error);
    return { title: "NewCuscatlan.com" };
  }
}

export default async function Page({ params }: Props) {
  return <PropertyDetailClient params={params} />;
}
{/* <div class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x47corl"><div class="xmjcpbm x1n2onr6"><div class="x78zum5 x14ju556 x6ikm8r x10wlt62 x1n2onr6" data-ad-rendering-role="image"><a aria-label="Rancho en venta en Costa Paraiso, Costa del sol | NewCuscatlan.com" class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xkrqix3 x1sur9pj x1s688f x5yr21d xh8yej3" href="#?aeg" role="link" tabindex="0" target="_blank"><div class="x6s0dn4 x1jx94hy x78zum5 xdt5ytf x6ikm8r x10wlt62 x1n2onr6 xh8yej3"><div style="max-width: 100%; min-width: 500px; width: calc(-622.605px + 191.571vh);"><div class="xqtp20y x6ikm8r x10wlt62 x1n2onr6" style="padding-top: 52.2%;"><div class="x10l6tqk x13vifvy" style="height: 100%; left: 0%; width: calc(100%);"><img data-imgperflogname="feedImage" height="261" width="500" class="x15mokao x1ga7v0g x16uus16 xbiv7yw x1ey2m1c x5yr21d xtijo5x x1o0tod x10l6tqk x13vifvy xh8yej3 xl1xv1r" alt="Rancho en venta en Costa Paraiso, Costa del sol | NewCuscatlan.com" referrerpolicy="origin-when-cross-origin" src="https://external.fsal11-1.fna.fbcdn.net/emg1/v/t13/7684497916875494470?url=https%3A%2F%2Fwww.newcuscatlan.com%2Fproperties%2FpWdBrAmM_z-I.jpeg&amp;fb_obo=1&amp;utld=newcuscatlan.com&amp;stp=c0.5000x0.5000f_dst-jpg_flffffff_p500x261_q75_tt6&amp;_nc_gid=2Htzi_LtFAlCdAGsQiiWeQ&amp;_nc_oc=AdndCbavrcNR3Rp923rFgFWNn8CK59pMjE6rmZIilBwlk8MG7GrjxZ8u_fXjsKc32Cw&amp;ccb=13-1&amp;oh=06_Q3-8AR9gEWZWDmKOxD4LCaUQWExcLqAi4NjttSKWzmLlswg1&amp;oe=69A8FE14&amp;_nc_sid=4b9d2d"></div></div></div></div><div class="x1nb4dca x1q0q8m5 xso031l x1exxf4d x13fuv20 x178xt8z x1ey2m1c x9f619 xtijo5x x1o0tod x47corl x10l6tqk x13vifvy"></div></a></div></div></div> */}