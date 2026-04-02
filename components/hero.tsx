import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      {/* Grid background */}
      <div className="grid-background grid-fade absolute inset-0 h-full w-full" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-7 px-6 pt-11.25 pb-28.75 md:px-25">
        {/* Profile Image */}
        <div className="animate-slide-up-long h-40 w-40 overflow-hidden rounded-full">
          <Image
            src="/image.png"
            alt="Juliansyah"
            width={200}
            height={200}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {/* Greeting */}
        <h3
          className="animate-slide-up-long font-(family-name:--font-bricolage) text-2xl font-normal text-white text-center"
          style={{ animationDelay: "0.1s" }}
        >
          Hello, I&apos;m Juliansyah 👋
        </h3>

        {/* Main Heading */}
        <h1
          className="heading-gradient animate-slide-up-long max-w-4xl text-center leading-[1.1]"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="font-(family-name:--font-bricolage) text-[clamp(3rem,5vw,75px)] font-normal not-italic">
            Interfaces That{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(3rem,5vw,75px)] italic">
            Look Good{" "}
          </span>
          <span className="font-(family-name:--font-bricolage) text-[clamp(3rem,5vw,75px)] font-normal not-italic">
            and{" "}
          </span>
          <span className="font-(family-name:--font-instrument) text-[clamp(3rem,5vw,75px)] italic">
            Work Better
          </span>
        </h1>

        {/* Status / Subtitle */}
        <p
          className="animate-slide-up-long max-w-178 text-center font-(family-name:--font-bricolage) text-2xl font-bold text-brand"
          style={{ animationDelay: "0.3s" }}
        >
          Front-End Developer &amp; UI/UX Designer
        </p>

        {/* Description */}
        <p
          className="animate-slide-up-long max-w-178 text-center font-[Helvetica,Arial,sans-serif] text-lg leading-normal text-gray-text"
          style={{ animationDelay: "0.4s" }}
        >
          I&apos;m a T-shaped developer who goes deep in Front-End engineering
          and UI/UX design — bridging the gap between how things look and how
          they work. I turn complex problems into interfaces people actually
          enjoy using.
        </p>

        {/* Marquee / Logo Strip */}
        <div
          className="animate-slide-up-long mt-8 h-23.25 w-full max-w-5xl overflow-hidden border-y border-white-15 py-2.5"
          style={{
            animationDelay: "0.5s",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="animate-marquee flex h-full w-max items-center gap-30">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-30">
                {[
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Tailwind CSS",
                  "Node.js",
                  "PostgreSQL",
                ].map((tech) => (
                  <span
                    key={`${setIndex}-${tech}`}
                    className="whitespace-nowrap text-sm font-medium uppercase tracking-widest text-gray-text"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
