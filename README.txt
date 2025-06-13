ere's how to run the React chatbot app locally:
1. Prerequisites
Make sure you have these installed:

Node.js (version 14 or higher) - Download here
npm or yarn package manager

2. Create New React App
bash# Create a new React app
npx create-react-app chatbot-app
cd chatbot-app

# Install required dependencies
npm install lucide-react @azure/msal-browser @azure/msal-react
3. Replace App.js Content
Replace the contents of src/App.js with the code from the artifact above, or create the file structure:
bash# Remove default files
rm src/App.css src/App.test.js src/logo.svg src/reportWebVitals.js src/setupTests.js

# Your src folder should have:
src/
├── App.js          # Main component (copy from artifact)
├── index.js        # Entry point
├── index.css       # Global styles
└── ...
4. Update index.css
Replace src/index.css with:
css@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
5. Install Tailwind CSS
bash# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Update tailwind.config.js
Update tailwind.config.js:
javascript/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
6. Run the App
bash# Start the development server
npm start

# Your app will open at http://localhost:3000
7. Project Structure
Your final project structure should look like:
chatbot-app/
├── public/
├── src/
│   ├── App.js          # Main chatbot component
│   ├── index.js        # React entry point
│   ├── index.css       # Global styles with Tailwind
├── package.json
├── tailwind.config.js
└── README.md
8. For Production Deployment
bash# Build for production
npm run build

# The build folder will contain optimized files
# Deploy the build folder to your hosting service
9. Connect to Real Services
To connect to real Microsoft OAuth and backend API:
Install MSAL packages:
bashnpm install @azure/msal-browser @azure/msal-react
Update your App.js to replace the mock services with real implementations:
javascript// Replace mockMicrosoftAuth with real MSAL
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`
  }
};

const msalInstance = new PublicClientApplication(msalConfig);
Create .env file in your root directory:
REACT_APP_CLIENT_ID=your-microsoft-app-client-id
REACT_APP_TENANT_ID=your-tenant-id
REACT_APP_API_BASE_URL=http://localhost:5000/api
Troubleshooting
If you get Tailwind errors:
bashnpm install -D tailwindcss@latest postcss@latest autoprefixer@latest
If lucide-react doesn't work:
bashnpm install lucide-react --force
Common issues:

Make sure Node.js version is 14+
Clear npm cache: npm cache clean --force
Delete node_modules and reinstall: rm -rf node_modules && npm install

The app will run with mock authentication and API calls initially. You can click "Sign in with Microsoft" to see the full chat interface in action!