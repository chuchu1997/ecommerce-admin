import prismadb from "@/lib/primadb";



interface DashboardPageProps { 

   params: Promise<{ storeId: string }>;



}
const DashboardPage:React.FC<DashboardPageProps> = async({

  params

})=>{

  const {storeId} = await params;
  const store = await prismadb.store.findFirst({
    where:{
      id:storeId
    }
  })


  return <div>

    Active Store: {store?.name}
  </div>
}


export default DashboardPage;

