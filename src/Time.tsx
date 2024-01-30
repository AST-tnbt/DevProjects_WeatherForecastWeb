export default function Time() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return (
        <div>
            <p className="text-lg mt-4 text-[#435057]">{monthNames[month]} {day}, {year}</p>
        </div>
    )
}
