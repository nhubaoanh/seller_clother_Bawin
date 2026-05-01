# 🖤 CLOTH SELLER — Editorial Fashion Ecosystem

Welcome to the **CLOTH SELLER** ecosystem, a premium, high-fashion apparel management and retail platform. This project is meticulously designed with an **Editorial Monochrome** aesthetic, blending minimalist sophistication with powerful administrative control and cutting-edge AI integration.

---

## 🏛️ System Architecture

The ecosystem is divided into three core pillars, ensuring scalability, security, and a seamless user experience.

### 1. Backend (BE)
- **Engine**: Node.js & Express.
- **Database**: MySQL, utilizing **Stored Procedures** for centralized business logic and high performance.
- **Security**: JWT (JSON Web Tokens) with a strictly enforced RBAC (Role-Based Access Control) layer.
- **Logic**: Comprehensive APIs for inventory, order processing, and user management.

### 2. Admin Command Center (gass)
- **Framework**: Next.js 16.0.1 (Turbopack).
- **Identity**: Strict administrative gate requiring `role_id: 1`.
- **UI/UX**: Avant-garde Editorial Monochrome design.
- **Features**: 
    - **Dashboard Stats**: Real-time business performance analytics.
    - **Inventory Control**: Advanced Product, Category, and Import Order management.
    - **Authority Control**: Comprehensive User registry management.
    - **Profile Atelier**: Real-time administrative identity management.

### 3. User Experience Portal (FE)
- **Framework**: Next.js.
- **UI/UX**: Premium Editorial layout with high-contrast aesthetics.
- **AI Integration**: **AI Stylist Chatbot** powered by Groq (Llama-3.3-70B).
- **Features**: 
    - **AI Stylist**: Real-time fashion consultant that suggests products with direct image previews.
    - **Archive Gallery**: Modern product grid with lightbox visualization.
    - **Cart System**: Seamless shopping bag and checkout protocol.

---

## ✨ Cutting-Edge Feature: AI Stylist Chatbot

The **CLOTH SELLER AI Stylist** is integrated into the User Portal to redefine digital shopping:
- **Visual Suggestions**: Unlike standard bots, our AI returns product recommendations with **actual image previews**.
- **Context-Aware**: The AI understands the entire store inventory and categories in real-time.
- **Brand Personality**: Trained to respond with a professional, editorial tone in Vietnamese.
- **Security**: Powered by Groq API via secured environment variables.

---

## 🚀 Deployment Protocol

To launch the full ecosystem, follow these sequences in separate terminals:

### Sequence 01: The Core (Backend)
```bash
cd BE
npm install
npm run dev # Port: 3000
```
*Ensure your `.env` file is configured with your MySQL credentials.*

### Sequence 02: Command Center (Admin)
```bash
cd gass
npm install
npm run dev # Port: 3002
```

### Sequence 03: User Portal (Frontend)
```bash
cd FE
npm install
npm run dev # Port: 3001
```

---

## 🔐 Security & Integrity

- **Environment Protection**: All sensitive keys (Groq API, DB Passwords, JWT Secrets) are stored in `.env.local` files and never exposed in the source code.
- **Identity Enforcement**: Admin routes are protected by role-based validation. Access is granted only to verified Administrative Identities.
- **Data Integrity**: MySQL Stored Procedures ensure data consistency across complex operations like order creation and inventory updates.

---

## 🎨 Editorial Design Philosophy

**CLOTH SELLER** follows a strict visual protocol:
- **Palette**: High-contrast Black (#000000) and White (#FFFFFF).
- **Typography**: Bold, black, uppercase headers with italicized highlights for an avant-garde feel.
- **Imagery**: Grayscale by default, coming to life with color on user interaction.
- **Shape**: Large, rounded corner radius (up to `3rem`) for a modern, fluid architecture.

---

**EDITORIAL CURATION BY NHU BAO ANH**  
*System Status: ARCHIVE LIVE*
