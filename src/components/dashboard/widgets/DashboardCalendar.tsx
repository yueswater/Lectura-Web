import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Handout {
  id: string;
  created_at: string;
}

interface DashboardCalendarProps {
  handouts: Handout[];
}

const DashboardCalendar = ({ handouts }: DashboardCalendarProps) => {
  const { t } = useTranslation();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const currentMonth = new Date(2026, 0); 
  const daysInMonth = new Date(2026, 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getHandoutCountForDate = (date: number) => {
    return handouts.filter(h => {
      const d = new Date(h.created_at);
      return d.getDate() === date && d.getMonth() === currentMonth.getMonth();
    }).length;
  };

  const getColorIntensity = (count: number) => {
    if (count === 0) return 'bg-base-200';
    if (count === 1) return 'bg-accent/20 text-accent-content';
    if (count === 2) return 'bg-accent/40 text-accent-content';
    if (count === 3) return 'bg-accent/70 text-accent-content';
    return 'bg-accent text-accent-content';
  };

  return (
    <div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-base-content">
          {t(`calendar.months.${currentMonth.getMonth()}`)} 2026
        </h3>
        <div className="flex gap-2">
          <button className="btn btn-xs btn-circle btn-ghost">
            <ChevronLeft size={16} />
          </button>
          <button className="btn btn-xs btn-circle btn-ghost">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs text-base-content/40 font-medium lowercase">
            {t(`calendar.days.${day.toLowerCase()}`)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const count = getHandoutCountForDate(date);
          const intensityClass = getColorIntensity(count);
          
          return (
            <div
              key={date}
              className={`aspect-square flex items-center justify-center text-xs rounded-md cursor-pointer transition-all hover:ring-2 hover:ring-accent/30 ${intensityClass}`}
              title={`${count} ${t('calendar.handouts')}`}
            >
              {date}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-1 text-[10px] text-base-content/40">
        <span>{t('calendar.less')}</span>
        <div className="w-2 h-2 bg-base-200 rounded-sm"></div>
        <div className="w-2 h-2 bg-accent/30 rounded-sm"></div>
        <div className="w-2 h-2 bg-accent/60 rounded-sm"></div>
        <div className="w-2 h-2 bg-accent rounded-sm"></div>
        <span>{t('calendar.more')}</span>
      </div>
    </div>
  );
};

export default DashboardCalendar;