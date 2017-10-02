import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';

class OrderDetails extends PureComponent {
  @autobind
  renderOrderItem({ label, unitPrice, quantity }) {
    return (
      <tr>
        <td>{label}</td>
        <td class="text-right">{unitPrice / 100}€</td>
        <td>{quantity}</td>
        <td class="text-right">{unitPrice * quantity / 100}€</td>
      </tr>
    );
  }

  render() {
    const {
      lang,
      order,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <table>
            <thead>
              <tr>
                <th><Text id="item">Item</Text></th>
                <th class="text-right"><Text id="unitPrice">Unit Price</Text></th>
                <th><Text id="quantity">Quantity</Text></th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              { order.OrderItems.map(this.renderOrderItem) }
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2" style="vertical-align: bottom; font-weight: normal;">
                  <p>
                    {order.conditions}
                  </p>
                  <p>
                    <em><Text id="ref">Order ref.</Text> {order.id}</em>
                  </p>
                </th>
                <th>
                  <p>Total</p>
                  <p><Text id="paid">Paid</Text></p>
                  <p><Text id="balance">Balance</Text></p>
                </th>
                <th class="text-right">
                  <p>{order.amount / 100}€</p>
                  <p>{order.totalPaid / 100}€</p>
                  <p>{order.balance / 100}€</p>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  item: 'Produits',
  unitPrice: 'Prix Unitaire',
  quantity: 'Quantité',
  ref: 'Réference de facture',
  paid: 'Payé à ce jour',
  balance: 'Montant dû',
} };

function mapStateToProps({ route: { lang }, orders, payment }) {
  return {
    lang,
    order: orders[payment.orderId],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
