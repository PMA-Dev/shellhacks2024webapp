import { useState, useEffect } from "react";
import api from "./api";
import { TemplateMetadata } from 

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const fetchTemplates = async () => {
    const response = await api.get("/metadata/all/template");
    setTemplates(response.data);
  };
  useEffect(() => {
    fetchTemplates();
    console.log("templates:", templates);
  });

  return {
    templates,
  };
};
