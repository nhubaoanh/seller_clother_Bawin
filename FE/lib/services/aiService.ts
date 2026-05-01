import axios from 'axios';
import { productService, normalizeProduct } from './productService';
import { categoryService } from './categoryService';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const aiService = {
  async getProductsContext() {
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getAll({ pageSize: 100 }),
        categoryService.getAll()
      ]);

      const products = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []);
      const categories = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);

      const normalizedProducts = products.map((p: any) => normalizeProduct(p)).filter(Boolean);
      
      return {
        products: (normalizedProducts as any[]).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.categoryName,
          stock: p.stock,
          image: p.image
        })),
        categories: categories.map((c: any) => c.categoryName || c.name)
      };
    } catch (error) {
      console.error("Failed to fetch context for AI", error);
      return { products: [], categories: [] };
    }
  },

  async sendMessage(messages: ChatMessage[]) {
    const context = await this.getProductsContext();
    
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `You are the SELLER CLOTH AI Stylist. You are professional, fashion-forward, and helpful.
      You help customers find clothes in our store.
      
      SHOP CONTEXT:
      - Name: SELLER CLOTH
      - Style: Editorial Monochrome, High-Fashion, Minimalist.
      - Categories: ${context.categories.join(', ')}
      
      AVAILABLE PRODUCTS (JSON):
      ${JSON.stringify(context.products)}
      
      INSTRUCTIONS:
      1. Always respond in Vietnamese as requested by the user.
      2. If a user asks for suggestions, look at the AVAILABLE PRODUCTS and suggest specific items.
      3. CRITICAL: When suggesting a product, you MUST include the product image URL in markdown format like this: ![Product Name](image_url)
      4. Be concise and editorial in your tone.
      5. If you don't find a specific product, suggest the closest match or a category.
      6. Mention prices clearly.`
    };

    try {
      const response = await axios.post(
        API_URL,
        {
          model: "llama-3.3-70b-versatile",
          messages: [systemPrompt, ...messages],
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }
};
