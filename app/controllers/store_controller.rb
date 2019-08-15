class StoreController < ApplicationController
  layout false
  
  def index
    @messenger_id = params['messenger_id']
    @promos =  Promo.all
    @merchant = Merchant.all
    @everydays = Everyday.all
    order = Order.find_or_create_by!(messenger_id: @messenger_id, status: "Open")
    @order = order
  end

  def menu
    @categories = Category.where(merchant_id: params['id'])
    @messenger_id = params['messenger_id']
    @order = Order.find_or_create_by!(messenger_id: @messenger_id, status: "Open")

    order_items = []
    populars = {}
    orders = Order.where.not(status: "Open")
    orders.collect{|x| order_items << x.order_items}
    @order_items = order_items.flatten

    @order_items.each do |oi|
      unless populars[oi.variant_id.to_s].present?
        populars[oi.variant_id.to_s] = oi.quantity
      else
        populars[oi.variant_id.to_s] += oi.quantity
      end
    end
    @populars = Hash[populars.sort_by{|k, v| v}.reverse].first(4)
  end

  def cart
    params.permit!
    messenger_id = params[:messenger_id]
    @product = Product.find(params['product'])
    @variants = @product.variants
    @order = Order.find_by(messenger_id: messenger_id, status: "Open")
  end

  def view_cart
    params.permit!
    messenger_id = params['messenger_id']
    @order = Order.find_by(messenger_id: messenger_id, status: "Open")
  end
  
  def checkout
    messenger_id = params['messenger_id']
    @order = Order.find_by(messenger_id: messenger_id, status: "Open")
  end

  def pending
    params.permit!
    @order = Order.find_by(messenger_id: params['messenger_id'], status: "Open")
    @order.update!(custumer_name: params['order']['custumer_name'], contact_no: params['order']['contact_no'], address: params['delivery_address_attributes'], payment_option: params['order']['payment_option'], message: params['order']['message'], status: "Pending")
    redirect_to "/store/completed?messenger_id=#{params['messenger_id']}"
  end
  
  def completed
    @order = Order.first
  end
end
