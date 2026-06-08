import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;
    
    // Only protect /admin routes except /admin/login
    if(pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = req.cookies.get('admin_session')?.value;

        if(!token || token !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', req.url))
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
}