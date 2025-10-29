import { ref, computed, onBeforeUnmount } from "vue";
import { date } from 'quasar';

const useCurrentTime = () => {
  const currentTime = ref(new Date());

  const updateCurrentTime = () => {
    currentTime.value = new Date();
  };

  const updateTimeInterval = setInterval(updateCurrentTime, 1000);

  onBeforeUnmount(() => {
    clearInterval(updateTimeInterval);
  });

  const formatDate = (dateObj) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dayName = days[dateObj.getDay()];
    const dayNumber = dateObj.getDate();
    const monthName = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${dayName}, ${dayNumber} de ${monthName} del ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return {
    currentTime: computed(() => formatDate(currentTime.value))
  };
};

export default useCurrentTime;
