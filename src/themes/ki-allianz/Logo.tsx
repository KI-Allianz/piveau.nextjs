import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/themes/ki-allianz/logo.svg"}
      alt={"Logo"}
      width={250}
      height={60}
    />
  );
}
