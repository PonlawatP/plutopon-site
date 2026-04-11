import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

interface TransitionProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function LinkTransition({ children, href, ...props }: TransitionProps) {
    const router = useRouter();

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();

    //   TODO: add transition effect
    //   example: transition-all-in-out duration-300

      await sleep(250);
      router.push(href as string);
      await sleep(250);
    }
  return (
    <Link href={href} onClick={handleClick} {...props}>{children}</Link>
  );
}