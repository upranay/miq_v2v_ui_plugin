# Migration controller - mostly service to initialize the react top level component
# and to handle the initial routing endpoint.
class MigrationController < ApplicationController
  before_action :check_privileges
  after_action :cleanup_action

  def index
    # this sets the active menu item, must match the item name in lib/manageiq-v2v/engine.rb
    @layout = 'migration'
    @page_title = _('Migration')
  end

  helper do
    def layout_full_center
      "layouts/full_center_v2v"
    end

    def mount_react_component(name, selector, data = [])
      javascript_tag(:defer => 'defer') do
        "$(v2v.mount('#{name}', '#{selector}', #{data.to_json}));".html_safe
      end
    end
  
  end

  menu_section :migration
end
