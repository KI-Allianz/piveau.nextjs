import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/themes/hammerhai/logo.png"}
      alt={"Logo"}
      width={80}
      height={80}
    />
  );
}
