import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "Deposit",
    link: "/reskin",
  },
  {
    label: "Withdraw",
    link: "/reskin/withdraw",
  },
  {
    label: "History",
    link: "/reskin/history",
  },
];
export const NavTabs = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 md:sticky dark:bg-reskin-dark-gray w-full">
      <div className="flex h-20 flex-row justify-between items-center w-full md:mx-auto max-w-5xl relative z-10">
        {tabs.map((tab, index) => (
          <Link
            className={`font-matter-mono h-full uppercase flex-1 flex justify-center items-center ${pathname === tab.link ? "border-t-orange md:border-b-orange dark:border-t-dark-reskin-orange font-bold dark:md:border-b-dark-reskin-orange" : "border-t-transparent md:border-b-[#D9D9D9]"} border-t-4 md:border-b-4 md:border-t-0 md:bottom-auto`}
            key={index}
            href={tab.link}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <hr className="hidden md:block w-full border-t-light-reskin-border-gray dark:border-t-dark-reskin-border-gray relative bottom-1" />
    </div>
  );
};
