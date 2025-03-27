import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/utils";


export async function GET(req: NextRequest) {
 
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json(
          { isAuthenticated: false, message: 'No token found' }, 
          { status: 401 }
        )
      }
      try {
        // Verify the token
        const userDecode = verifyToken(token);

          // setUser()
        return NextResponse.json({
          isAuthenticated: true,
          message: 'Token is valid',
          user: userDecode // This will contain the payload you set when creating the token
        },{status:200})
      } catch (error) {
        // Token is invalid or expired
        return NextResponse.json(
          { 
            isAuthenticated: false, 
            message: 'Invalid or expired token' 
          }, 
          { status: 401 }
        )
      }
    


  
     
}