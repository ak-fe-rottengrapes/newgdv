import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (req.nextUrl.pathname.startsWith('/admin') && token.is_admin === false) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/employee') && token.is_employee === false) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/employee','/user'], 
}
