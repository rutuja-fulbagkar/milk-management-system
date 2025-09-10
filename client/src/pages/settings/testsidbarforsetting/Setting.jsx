import { Box, Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { WarehouseAddPage } from "../../routes/element";
import SettingLayout from "./SettingLayout";  
// import ServiceSetting from "./service/ServiceSetting";

const tabs = [{ label: "Service", path: "service" }];

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split("/").pop();

  const handleChange = (event, newValue) => {
    navigate(`/setting/${newValue}`);
  };

  return (
    <SettingLayout>
    <Box>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box>
          <Tabs
            value={currentTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.path} label={tab.label} value={tab.path} />
            ))}
          </Tabs>
        </Box>
      </Paper>
      <Routes>
        <Route path="/setting/service" element={<Navigate to="service" />} />
        <Route path="service" element={<WarehouseAddPage />} />
        {/* <Route path="account" element={<Account />} />
          <Route path="notifications" element={<Notifications />} /> */}
      </Routes>

      
    </Box>
    </SettingLayout>
  );
}
