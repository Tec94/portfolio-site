import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { CalendarDays, ExternalLink } from 'lucide-react';

const CAL_LINK = 'jack-cao/30min';

export default function V2BookingWidget() {
  useEffect(() => {
    void getCalApi().then((cal) => {
      cal('ui', {
        styles: { branding: { brandColor: '#1749ff' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    });
  }, []);

  return (
    <section className="v2-booking-panel" aria-labelledby="booking-title">
      <CalendarDays aria-hidden="true" />
      <div>
        <p className="v2-eyebrow">Cal.com booking</p>
        <h2 id="booking-title">Choose a time to compare notes.</h2>
        <p>The scheduling experience opens only after you activate it.</p>
      </div>
      <button
        className="v2-button v2-button-primary"
        data-cal-link={CAL_LINK}
        data-cal-config='{"layout":"month_view","theme":"dark"}'
      >
        Open calendar <ExternalLink size={16} aria-hidden="true" />
      </button>
    </section>
  );
}
