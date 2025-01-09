terraform {
  required_version = ">= 1.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = ">= 1.0.0"
    }
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id   
  features {}
}

provider "azuread" {}

data "azurerm_client_config" "current" {}

variable "subscription_id" {
  type    = string
  default = ""
}

variable "prefix" {
  type = string
}

variable "location" {
  type    = string
  default = "eastus"
}

variable "admin_username" {
  type    = string
  default = "azureuser"
}

variable "admin_password" {
  type      = string
  default   = null
  sensitive = true
}

variable "vm_size" {
  type    = string
  default = "Standard_B1s"
}

resource "azurerm_resource_group" "rg" {
  name     = "${var.prefix}-rg"
  location = var.location
}

resource "azurerm_virtual_network" "vnet" {
  name                = "${var.prefix}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "${var.prefix}-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "pip" {
  name                = "${var.prefix}-pip"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Basic"
}

resource "azurerm_network_interface" "nic" {
  name                = "${var.prefix}-nic"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.pip.id
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                  = "${var.prefix}-vm"
  resource_group_name   = azurerm_resource_group.rg.name
  location              = var.location
  size                  = var.vm_size
  admin_username        = var.admin_username
  admin_password        = var.admin_password
  network_interface_ids = [azurerm_network_interface.nic.id]
  disable_password_authentication = false

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    disk_size_gb         = 30
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}

resource "azuread_application" "aad_app" {
  display_name = "${var.prefix}-app"
}

resource "azuread_service_principal" "aad_sp" {
  client_id = azuread_application.aad_app.client_id
}

resource "azuread_application_password" "aad_app_password" {
  application_id = azuread_application.aad_app.id
}

resource "azurerm_key_vault" "key_vault" {
  name                     = "${var.prefix}-kv"
  location                 = var.location
  resource_group_name      = azurerm_resource_group.rg.name
  tenant_id                = data.azurerm_client_config.current.tenant_id
  sku_name                 = "standard"
  purge_protection_enabled = true

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azuread_service_principal.aad_sp.object_id
    secret_permissions      = ["Get", "List", "Set", "Delete", "Recover", "Backup"]
    certificate_permissions = ["Get", "List", "Create", "Delete", "Recover", "Backup"]
    key_permissions         = ["Get", "List", "Create", "Delete", "Decrypt", "Encrypt", "Sign", "UnwrapKey", "WrapKey", "Verify", "Recover", "Backup"]
  }
}

output "application_id" {
  value = azuread_application.aad_app.id
}

output "service_principal_id" {
  value = azuread_service_principal.aad_sp.id
}

output "service_principal_password" {
  value     = azuread_application_password.aad_app_password.value
  sensitive = true
}

