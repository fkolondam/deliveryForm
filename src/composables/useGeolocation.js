import { ref, onMounted, onUnmounted } from 'vue';

export function useGeolocation() {
  const coords = ref({ latitude: null, longitude: null });
  const error = ref(null);
  let watcher = null;

  onMounted(() => {
    if ('geolocation' in navigator) {
      watcher = navigator.geolocation.watchPosition(
        position => {
          coords.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          error.value = null;
        },
        err => {
          error.value = err.message;
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      error.value = 'Geolocation is not supported';
    }
  });

  onUnmounted(() => {
    if (watcher) navigator.geolocation.clearWatch(watcher);
  });

  return {
    coords,
    error
  };
}
