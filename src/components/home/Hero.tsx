import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Hero = () => {
    const { t } = useTranslation();
    return (
        <div className="hero min-h-[80vh] bg-base-100 relative overflow-hidden transition-colors duration-300">
            <div className="hero-content text-center flex-col z-10 w-full max-w-6xl">
                <div className="max-w-3xl mb-10 mt-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-base-content leading-tight mb-6">
                        {t('hero.title')} <br />
                        <span className="text-base-content relative inline-block">
                            {t('hero.subtitle')}
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-info/80 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="py-6 text-xl text-base-content/60 max-w-2xl mx-auto">
                        {t('hero.description')}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/register" className="btn btn-neutral btn-lg rounded-full px-8 text-neutral-content shadow-lg shadow-neutral/30">
                            {t('hero.get_started')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                    </div>
                </div>
                <div className="w-full relative mt-10">
                    <div className="mockup-browser border border-base-300 bg-base-200 shadow-2xl rounded-3xl overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
                        <div className="mockup-browser-toolbar">
                            <div className="input border border-base-300 bg-base-100">https://lectura.app/dashboard</div>
                        </div>
                        <div className="bg-base-200/50 flex justify-center px-4 py-16 border-t border-base-300 min-h-[500px] relative">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-6">
                                    <div className="stat-title text-left mb-2 text-base-content/60">Total Handouts</div>
                                    <div className="text-4xl font-bold text-left text-base-content">187</div>
                                    <div className="text-success text-left mt-2 text-sm flex items-center gap-1">
                                        <span className="font-bold">↑ 12%</span> on this week
                                    </div>
                                </div>
                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-6">
                                    <div className="stat-title text-left mb-2 text-base-content/60">Total Students</div>
                                    <div className="text-4xl font-bold text-left text-base-content">1,230</div>
                                    <div className="text-success text-left mt-2 text-sm flex items-center gap-1">
                                        <span className="font-bold">↑ 18%</span> on this week
                                    </div>
                                </div>
                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-6 md:row-span-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg text-base-content">Analytics</h3>
                                        <button className="btn btn-circle btn-ghost btn-sm">⋮</button>
                                    </div>
                                    <div className="radial-progress text-info mx-auto my-auto" style={{ "--value": 80, "--size": "12rem", "--thickness": "1rem" } as any} role="progressbar">
                                        <span className="text-4xl font-bold text-base-content">80%</span>
                                    </div>
                                    <div className="text-center mt-4 text-base-content/60">Completion Rate</div>
                                </div>
                                <div className="card bg-base-100 shadow-sm border border-base-300/50 p-6 col-span-1 md:col-span-2 h-64">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg text-base-content">Activity Report</h3>
                                    </div>
                                    <div className="w-full h-full flex items-end justify-between gap-2 px-4 pb-4">
                                        {[40, 70, 45, 90, 60, 75, 50].map((h, i) => (
                                            <div key={i} className="w-full bg-info/80 rounded-t-md hover:bg-info transition-colors relative group" style={{ height: `${h}%`, opacity: 0.3 + (h / 100) }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-content text-base-100 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-neutral/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero;