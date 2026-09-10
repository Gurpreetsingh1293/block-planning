/**
 * Mock Data: Station Timetable and Live Board
 */

export const STATION_TIMETABLES = {
  'NDLS': {
    stationCode: 'NDLS',
    stationName: 'New Delhi',
    date: 'TODAY',
    displayDate: 'SEPTEMBER 07, 2026',
    entries: [
      {
        id: 'tt-1',
        time: '09:35',
        trainNumber: '12002',
        trainName: 'Bhopal Shatabdi',
        route: 'Bhopal → New Delhi',
        type: 'Arrival',
        platform: 'PF 2',
        status: 'ON TIME',
        delay: 0,
        remarks: 'Main line platform clear'
      },
      {
        id: 'tt-2',
        time: '10:05',
        trainNumber: '12952',
        trainName: 'Mumbai Rajdhani',
        route: 'Mumbai → New Delhi',
        type: 'Arrival',
        platform: 'PF 4',
        status: 'ON TIME',
        delay: 0,
        remarks: 'Approaching Okhla'
      },
      {
        id: 'tt-3',
        time: '10:30',
        trainNumber: '12310',
        trainName: 'Rajdhani Express',
        route: 'New Delhi → Howrah',
        type: 'Departure',
        platform: 'PF 3',
        status: 'DELAYED 12 MIN',
        delay: 12,
        remarks: 'Rake shunting in progress (+12 MIN)'
      },
      {
        id: 'tt-4',
        time: '11:15',
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        route: 'New Delhi → Varanasi',
        type: 'Departure',
        platform: 'PF 1',
        status: 'ON TIME',
        delay: 0,
        remarks: 'Security & catering check complete'
      },
      {
        id: 'tt-5',
        time: '11:45',
        trainNumber: '70521',
        trainName: 'Dedicated Freight (BOXN)',
        route: 'Singrauli → Dadri DFC',
        type: 'Through Transit',
        platform: 'Goods Line 2',
        status: 'ON TIME',
        delay: 0,
        remarks: 'Heavy coal movement'
      }
    ]
  }
};
