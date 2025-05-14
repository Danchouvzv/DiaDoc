# DiaDoc: Your Smart Diabetes Companion

![DiaDoc Logo](/public/medical-diabetes-bg.png)

## Overview

DiaDoc is an intelligent mobile application designed to help people with diabetes effectively manage their health. The application provides AI-driven insights, personalized recommendations, and intuitive tools to track and optimize diabetes management.

## Key Features

- **AI-Powered Food Logging**: Snap a photo or describe your meal, and our advanced AI instantly calculates precise nutritional content
- **Seamless Activity Tracking**: Automatically sync with favorite devices to monitor workouts, steps, and daily activities
- **Comprehensive Health Metrics**: Monitor glucose levels, sleep quality, stress, and other vital health indicators in one intuitive dashboard
- **Personalized AI Insights**: Advanced AI analyzes unique health patterns to deliver personalized recommendations
- **Detailed Progress Reports**: Visualize health journey with beautiful charts and comprehensive reports to share with healthcare providers
- **Community Support**: Join a supportive community and access personalized educational resources

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: Shadcn UI
- **Animation**: Framer Motion for smooth transitions and interactions
- **Styling**: Tailwind CSS for responsive and elegant UI design
- **Authentication**: NextAuth.js for secure user authentication
- **Data Visualization**: Recharts for beautiful data representations

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Danchouvzv/DiaDoc.git
   cd DiaDoc
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
DiaDoc/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API routes for backend functionality
│   │   ├── dashboard/           # Dashboard pages for authenticated users
│   │   ├── auth/                # Authentication pages (login, register)
│   │   └── landing/             # Landing page
│   ├── components/              # Reusable React components
│   │   ├── ui/                  # UI components from shadcn/ui
│   │   └── ...                  # Other components
│   ├── lib/                     # Utility functions and libraries
│   └── styles/                  # Global styles and CSS modules
├── public/                      # Static assets
└── ...                          # Configuration files
```

## Features in Development

- **Meal Suggestion Based on Glucose Levels**: AI-powered recommendations for meals based on current glucose readings
- **Predictive Analytics**: Forecasting potential glucose fluctuations based on historical data
- **Integration with Medical Devices**: Direct connection with glucose monitors and insulin pumps
- **Telemedicine Features**: Connect with healthcare providers directly through the app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries about the project, please reach out to Dancho at [email address].

---

*DiaDoc - Take Control of Your Health*
