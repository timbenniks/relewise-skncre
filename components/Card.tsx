import Image from "next/image";

interface Props {
  __typename?: string;
  title: string;
  image: {
    url: string;
  };
  url: string;
  cta: string;
  small?: boolean;
  brand:string;
}

export default function Card({ image, title, url, cta, small, brand }: Props) {
  const titleClassYour = small
    ? "block text-primary font-bold font-title text-xl"
    : "block text-primary font-bold font-title text-4xl md:text-6xl";
  const titleClassRest = small
    ? "block text-dark font-bold font-title text-xl"
    : "block text-dark font-bold font-title text-3xl sm:text-4xl md:text-6xl sm:ml-8 sm:-mt-2";

  const titleWrapperClass = small
    ? "absolute top-6 md:top-auto md:bottom-4 left-4"
    : "absolute top-6 md:top-auto md:-bottom-6 left-8";

  return (
    <div className="bg-tertiary aspect-[1/1] relative">
      <a className="block absolute w-full h-full top-0 left-0" href={url}>
        <Image
          src={image.url}
          alt={title}
          width={500}
          height={500}
          className="absolute w-full h-auto"
          sizes="100vw"
          loading="lazy"
        />

        <button className="cta absolute bottom-4 right-4">{cta}</button>
        <div className={titleWrapperClass}>
          <h3>
            <span className={titleClassYour}>{brand}</span>
            <span className={titleClassRest}>{title}</span>
          </h3>
        </div>
      </a>
    </div>
  );
}
