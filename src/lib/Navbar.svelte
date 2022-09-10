<script lang="ts">
  import { faMoon } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useEffect, useState } from "svelte-check";
  import { Button, FormControl, Navbar } from "sveltestrap";

  function setup() {
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
          setShowNav(false);
        } else {
          setShowNav(true);
        }
        setLastScrollY(currentScrollY);
      };
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [lastScrollY]);
    const toggleDarkMode = () => {
      const darkmode = !document.documentElement.classList.contains("dark");
      localStorage.setItem("darkMode", darkmode.toString());
      document.documentElement.classList.toggle("dark", darkmode);
    };
    return {
      showNav,
      toggleDarkMode,
    };
  }
</script>

<Navbar
    variant="dark"
    style={{
        top: showNav ? 0 : -100,
        zIndex: 100
    }}
    className={"navbar"}
>
    <Button
        onClick={toggleDarkMode}
        className={"ml-4 py-2 px-3 bg-slate-500 dark:bg-slate-200 transition-all rounded-full"}
    >
        <FontAwesomeIcon icon={faMoon} />
    </Button>
    <Navbar.Brand>Laudiolin</Navbar.Brand>
    <Navbar.Collapse>
        <div className={"inline-flex rounded-md shadow-sm"}>
            <FormControl
                type="text"
                placeholder="query"
                className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-transparent rounded-l-lg border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            />
            <Button
                className={"inline-flex items-center py-2 px-4 text-sm font-medium bg-transparent rounded-l-lg  text-white dark:border-indigo-600 dark:hover:bg-gray-700 dark:focus:bg-gray-700"}
            >
                Search
            </Button>
        </div>
    </Navbar.Collapse>
</Navbar>;
