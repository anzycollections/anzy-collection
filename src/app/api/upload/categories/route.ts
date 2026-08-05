import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const categories = await sql`SELECT * FROM categories ORDER BY "order" ASC`;
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur GET categories:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, visible, order } = body;

    const result = await sql`
      INSERT INTO categories (id, name, visible, "order")
      VALUES (${id}, ${name}, ${visible ?? true}, ${order ?? 0})
      ON CONFLICT (id) DO UPDATE
      SET name = ${name}, visible = ${visible ?? true}, "order" = ${order ?? 0}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Erreur POST categories:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}