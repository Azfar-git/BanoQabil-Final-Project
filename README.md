## Firebase Integration

- Firebase Authentication integrated (Email/Password)
- Firestore database connected
- Role-based user system implemented
- Roles supported:
  - admin
  - supervisor
  - teacher
  - student
  - user
- Users are created by admin with assigned roles

## BanoQabil Website Theme

**1. MAIN COLORS**

**Primary Colors**
/* Blue to Purple Gradient - MAIN COLOR */
Background: linear-gradient(to right, #2563EB, #7C3AED)

/* Individual Colors */
Blue: #2563EB    (rgb(37, 99, 235))
Purple: #7C3AED  (rgb(124, 58, 237))

**Background Colors**
Light Mode: White background (#FFFFFF)
Dark Mode: Dark gray background (#111827)
Cards: Light gray (#F3F4F6) in light mode

**Text Colors**
Headings: Dark gray (#1F2937)
Body Text: Gray (#4B5563)
White Text: On blue/purple backgrounds

**2. FONTS (Only 2 Fonts)**

/* For ALL Headings (h1, h2, h3, h4) */
font-family: 'Montserrat', sans-serif;
font-weight: bold;

/* For ALL Body Text (paragraphs, buttons) */
font-family: 'Inter', sans-serif;
font-weight: normal;

**3. BUTTONS**

**Primary Button (Main Action)**
className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90"

**Secondary Button (Less Important)**
className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-200"

**Dark Mode Buttons**
// Just add "dark:" before colors
className="dark:bg-gray-800 dark:text-white dark:border-gray-700"

**4. CARDS (All Cards Should Look Like This)**

// Standard Card
className="bg-white rounded-xl p-6 shadow-lg"

// Card with hover effect
className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"

// Dark mode card
className="dark:bg-gray-800 dark:text-white"

**5. SPACING (Keep Consistent)**

/* Between Sections */
margin-bottom: 3rem  (use mb-12 in Tailwind)

/* Between Cards */
gap: 2rem  (use gap-8 in Tailwind)

/* Inside Cards */
padding: 1.5rem  (use p-6 in Tailwind)

/* Container Width */
max-width: 80rem  (use max-w-7xl in Tailwind)
center it with: mx-auto

**6. RESPONSIVE RULES**

// Mobile (< 768px): 1 column
className="grid grid-cols-1"

// Tablet (768px+): 2 columns  
className="md:grid-cols-2"

// Desktop (1024px+): 3 columns
className="lg:grid-cols-3"

// Example for course cards:
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"

**7. DARK MODE - Simple Rule**

// Light colors first, then dark:
className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white"

// Complete example for a card:
className="bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800 dark:text-white"

**8. SPECIAL EFFECTS (Use Sparingly)**

// Gradient text (for important headings)
className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"

// Hover effect on cards
className="hover:scale-105 transition-transform duration-300"

// Shadow on hover
className="hover:shadow-xl transition-shadow duration-300"
