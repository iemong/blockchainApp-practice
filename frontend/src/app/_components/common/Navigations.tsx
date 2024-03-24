'use client'

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export const Navigations = () =>
	(
		<>
			<NavigationMenu orientation="vertical" className="items-start w-full max-w-none">
				<NavigationMenuList className="flex-col gap-4">
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								Home
							</NavigationMenuLink>
						</Link>{" "}
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</>
	);
