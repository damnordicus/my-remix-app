import MainButton from "~/components/MainButton";

export default function Index() {
  let pic = '';
  const rand = Math.floor(Math.random() * 15);
  switch(rand){
    case 0:
      pic = 'fil1.jpg';
      break;
    case 1:
      pic = 'fil2.jpg';
      break;
    case 2:
      pic = 'fil3.jpg';
      break;
    case 3:
      pic = 'fil4.jpg';
      break;
    case 4:
      pic = 'fil5.jpg';
      break;
    case 5:
      pic = 'fil6.jpg';
      break;
    case 7:
      pic = 'fil7.jpg';
      break;
    case 8:
      pic = 'fil8.jpg';
      break;
    case 9:
      pic = 'fil9.jpg';
      break;
    case 10:
      pic = 'fil0.jpg';
      break;
    case 11:
      pic = 'fil11.jpg';
      break;
    case 12:
      pic = 'fil12.jpg';
      break;
    case 13:
      pic = 'fil13.jpg';
      break;
    case 14:
      pic = 'fil14.jpg';
      break;
  }
  
  return (
    <div className={`bg-[url('/public/fil3.jpg')] bg-cover min-h-screen flex items-center justify-center `}>
      <div className="w-[465px] h-[360px] justify-center bg-slate-700 border-4 border-amber-500 rounded-xl flex flex-row flex-wrap items-center  gap-4 p-4">
        <MainButton text="Pull From Stock" link="pullFilament"/>
        <MainButton text="Return To Stock" link="returnFilament"/>
        <MainButton text="View Stock" link="inventory" />
        <div className="flex items-center justify-center w-[200px] h-[150px] bg-gray-600 bodrer-2 rounded-xl ">

        </div>
      </div>
      {/* {(filaments && filaments.length > 0) ? (<Inventory filaments={filaments} brands={brands} colors={colors} materials={materials}/>):(
        <p>No filament in databse.</p>
      )} */}
     
    </div>
  );
}
