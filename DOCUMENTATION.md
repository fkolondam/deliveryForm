# Project Documentation: Form Pengiriman Barang

## Project Overview
This project is a Vue.js application designed for managing delivery forms. It allows users to input delivery information, upload relevant photos, and submit the form for processing. The application is built using Vite as the build tool and Tailwind CSS for styling.

## Project Structure
```
.
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.vue
    ├── main.js
    ├── style.css
    ├── components/
    │   └── PhotoUpload.vue
    ├── composables/
    │   ├── useGeolocation.js
    │   └── usePhotoWithMetadata.js
    └── services/
        └── api.js
```

### Key Files
- **index.html**: The entry point for the application.
- **package.json**: Contains project metadata and dependencies.
- **vite.config.js**: Configuration for Vite.
- **src/App.vue**: The main component of the application.
- **src/main.js**: Initializes the Vue application.
- **src/components/**: Contains reusable components.
- **src/composables/**: Contains reusable composition functions.
- **src/services/**: Contains service files for API interactions.

## Key Features
- Dynamic tab navigation for "Form" and "Attachments."
- Form validation to ensure required fields are filled out.
- Photo upload functionality for delivery-related images.
- Geolocation integration to capture user location during form submission.

## Code Logic
- The application is structured around a main component (`App.vue`) that manages the layout and logic.
- The form includes various fields for driver information, delivery details, and payment methods.
- The application uses Vue's Composition API for state management and lifecycle hooks.
- Data fetching is handled in the `onMounted` lifecycle hook to populate dropdowns and validate user input.

## Data Source Access
- The application interacts with an API through the `api.js` service file, which handles fetching branch configurations and invoice lists, as well as submitting form data.

## Future Development
This documentation will be updated as the project evolves and new features are added. It will serve as a navigation guide for ongoing development efforts.
