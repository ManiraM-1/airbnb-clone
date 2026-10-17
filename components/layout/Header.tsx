"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { AirbnbLogo } from "@/components/icons/AirbnbLogo";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import styles from "./Header.module.css";

// Fixed UI chrome (not listing content).
const SEARCH_HOUSE_SRC = "/assets/images/ui/searchbar-house.png";
const LABELS = {
  home: "Airbnb homepage",
  where: "Anywhere",
  when: "Anytime",
  who: "Add guests",
  search: "Search",
  host: "Become a host",
  language: "Choose a language and currency",
  menu: "Main navigation menu",
} as const;

/** SPEC §10.4: these controls do nothing in the reference. */
function preventNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

// Top bar: SPEC §2. Not sticky.
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={LABELS.home}>
          <AirbnbLogo />
        </Link>

        <div role="search" className={styles.search}>
          <button type="button" className={`${styles.searchButton} ${styles.where}`}>
            <Image
              src={SEARCH_HOUSE_SRC}
              alt=""
              width={48}
              height={48}
              unoptimized
              loading="eager"
              className={styles.house}
            />
            <span>{LABELS.where}</span>
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={`${styles.searchButton} ${styles.when}`}>
            {LABELS.when}
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={`${styles.searchButton} ${styles.who}`}>
            {LABELS.who}
          </button>
          <button type="button" className={styles.submit} aria-label={LABELS.search}>
            <SearchIcon size={16} strokeWidth={3} />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Main">
          <a href="#" className={styles.hostLink} onClick={preventNavigation}>
            {LABELS.host}
          </a>
          <button type="button" className={styles.circle} aria-label={LABELS.language}>
            <GlobeIcon size={20} strokeWidth={1.6} />
          </button>
          <button type="button" className={styles.circle} aria-label={LABELS.menu}>
            <MenuIcon size={16} strokeWidth={2.25} strokeLinecap="square" />
          </button>
        </nav>
      </div>
    </header>
  );
}
