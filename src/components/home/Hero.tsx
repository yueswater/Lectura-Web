import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Hero = () => {
    const { t } = useTranslation();
    return (
        <div className="hero min-h-[80vh] bg-base-100 relative overflow-hidden transition-colors duration-300">
            <div className="hero-content text-center flex-col z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mb-6 md:mb-10 mt-6 md:mt-10">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-base-content leading-[1.1] mb-6">
                        {t('hero.title')} <br />
                        <span className="text-base-content relative inline-block">
                            {t('hero.subtitle')}
                            <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-info/80 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="py-4 md:py-6 text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto px-2">
                        {t('hero.description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
                        <Link to="/dashboard" className="btn btn-neutral btn-md md:btn-lg rounded-full px-8 text-neutral-content shadow-lg shadow-neutral/30 w-full sm:w-auto">
                            {t('hero.get_started')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                    </div>
                </div>

                <div className="w-full relative mt-8 md:mt-12 max-w-6xl mx-auto">
                    <div className="mockup-browser border border-base-300 bg-base-200 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
                        <div className="mockup-browser-toolbar">
                            <div className="input border border-base-300 bg-base-100 text-[10px] sm:text-xs md:text-sm truncate max-w-[150px] sm:max-w-none">
                                https://lectura.app/dashboard
                            </div>
                        </div>
                        <div className="bg-base-200/50 flex justify-center px-2 sm:px-4 py-8 md:py-16 border-t border-base-300 min-h-fit relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">

                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-4 md:p-6">
                                    <div className="stat-title text-left mb-1 md:mb-2 text-xs md:text-sm text-base-content/60">Total Handouts</div>
                                    <div className="text-2xl md:text-4xl font-bold text-left text-base-content">187</div>
                                    <div className="text-success text-left mt-2 text-[10px] md:text-sm flex items-center gap-1">
                                        <span className="font-bold">↑ 12%</span>
                                    </div>
                                </div>

                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-4 md:p-6">
                                    <div className="stat-title text-left mb-1 md:mb-2 text-xs md:text-sm text-base-content/60">Total Students</div>
                                    <div className="text-2xl md:text-4xl font-bold text-left text-base-content">1,230</div>
                                    <div className="text-success text-left mt-2 text-[10px] md:text-sm flex items-center gap-1">
                                        <span className="font-bold">↑ 18%</span>
                                    </div>
                                </div>

                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-4 md:p-6 sm:col-span-2 md:col-span-1 md:row-span-2 flex flex-col justify-center items-center">
                                    <div className="flex justify-between items-center w-full mb-4">
                                        <h3 className="font-bold text-sm md:text-lg text-base-content">Analytics</h3>
                                    </div>
                                    <div
                                        className="radial-progress text-info my-auto [--value:80] [--size:8rem] [--thickness:0.8rem] md:[--size:12rem] md:[--thickness:1rem]"
                                        role="progressbar"
                                    >
                                        <span className="text-2xl md:text-4xl font-bold text-base-content">80%</span>
                                    </div>
                                    <div className="text-center mt-4 text-xs md:text-sm text-base-content/60">Completion Rate</div>
                                </div>

                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-4 md:p-6 col-span-1 sm:col-span-2 h-48 md:h-64">
                                    <div className="flex justify-between items-center mb-4 text-base-content">
                                        <h3 className="font-bold text-sm md:text-lg">Activity Report</h3>
                                    </div>
                                    <div className="w-full h-full flex items-end justify-between gap-1 md:gap-2 px-1 md:px-4 pb-4">
                                        {[40, 70, 45, 90, 60, 75, 50].map((h, i) => (
                                            <div key={i} className="w-full bg-info/80 rounded-t-sm md:rounded-t-md hover:bg-info transition-colors relative group" style={{ height: `${h}%`, opacity: 0.3 + (h / 100) }}>
                                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-base-content text-base-100 text-[8px] md:text-xs py-0.5 md:py-1 px-1 md:px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{h}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;