import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer footer-center p-10 bg-base-200 text-base-content/70 rounded mt-20">
            <nav className="grid grid-flow-col gap-4">
                <a className="link link-hover">{t('footer.about_us')}</a>
                <a className="link link-hover">{t('footer.contact')}</a>
                <a className="link link-hover">{t('footer.privacy_policy')}</a>
                <a className="link link-hover">{t('footer.terms_of_service')}</a>
            </nav>
            <aside>
                <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            </aside>
        </footer>
    );
};

export default Footer;