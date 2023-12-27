import Footer from "../footer/Footer"
import Header from "../header/Header"

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <div style={{ minHeight: "80vh" }}>
                {children}
            </div>
            <Footer />
        </>
    )
}

export default Layout;