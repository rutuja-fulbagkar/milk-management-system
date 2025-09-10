import { useLocation, Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const routeLabels = {
  new: 'New',
  edit: 'Edit',
  view: 'View',
};

const isLikelyId = (segment) => /^[0-9a-f]{24}$/i.test(segment) || /^[0-9a-f-]{8,}$/i.test(segment);

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = [];

  for (let i = 0; i < pathnames.length; i++) {
    const segment = pathnames[i];

    // Skip IDs
    if (isLikelyId(segment)) continue;

    breadcrumbs.push({
      label: routeLabels[segment] || capitalize(segment),
      to: `/${pathnames.slice(0, i + 1).join('/')}`,
    });
  }

  return (
    <nav className="text-sm ">
      <ol className="flex items-center flex-wrap text-gray-600 dark:text-gray-300">
        <li>
          <Link to="/" className="hover:underline font-medium text-blue-800 dark:text-blue-700">
            Dashboard
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.to} className="flex items-center">
            <ChevronRightIcon fontSize="small" className="mx-1 text-gray-400" />
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-800 dark:text-white capitalize">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.to} className="hover:underline capitalize">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default Breadcrumbs;

//
// import { useLocation, Link } from 'react-router-dom';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// const routeLabels = {
//   new: 'New',
//   edit: 'Edit',
//   view: 'View',
// };

// const isLikelyId = (segment) => /^[0-9a-f]{24}$/i.test(segment) || /^[0-9a-f-]{8,}$/i.test(segment);

// const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// const Breadcrumbs = () => {
//   const location = useLocation();
//   const pathnames = location.pathname.split('/').filter(Boolean);

//   const breadcrumbs = [];

//   for (let i = 0; i < pathnames.length; i++) {
//     const segment = pathnames[i];

//     if (isLikelyId(segment)) continue;

//     breadcrumbs.push({
//       label: routeLabels[segment] || capitalize(segment),
//       to: `/${pathnames.slice(0, i + 1).join('/')}`,
//     });
//   }

//   const moduleName = breadcrumbs.length > 0 ? breadcrumbs[0].label : 'Dashboard';

//   return (
//     <div className="w-full mb-4">
//       {/* Module Title */}
//       <h2 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white capitalize mt-2 mb-1">
//         {moduleName}
//       </h2>

//       {/* Breadcrumb Trail */}
//       <nav className="text-sm w-full overflow-x-auto">
//         <ol className="flex flex-wrap items-center text-gray-600 dark:text-gray-300 whitespace-nowrap">
//           <li className="shrink-0">
//             <Link to="/" className="hover:underline font-medium text-blue-700 dark:text-blue-400 ">
//               Dashboard
//             </Link>
//           </li>

//           {breadcrumbs.slice(1).map((crumb, index) => (
//             <li key={crumb.to} className="flex items-center shrink-0">
//               <ChevronRightIcon fontSize="small" className="mx-1 text-gray-400" />
//               {index === breadcrumbs.length - 2 ? (
//                 <span className="font-medium text-gray-800 dark:text-white capitalize">
//                   {crumb.label}
//                 </span>
//               ) : (
//                 <Link to={crumb.to} className="hover:underline capitalize">
//                   {crumb.label}
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ol>
//       </nav>
//     </div>
//   );
// };

// export default Breadcrumbs;
