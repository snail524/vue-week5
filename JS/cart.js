Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });
  VeeValidateI18n.loadLocaleFromURL('./JS/zh_TW.json');

  // Activate the locale
  VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
  });

const url = 'https://vue3-course-api.hexschool.io/v2';
const path =  'immigrant524';
const app = Vue.createApp({
    data(){
        return{
            // products: [],
            cartProducts: {},
            productId: '',
            cartsData: {},
            isloadingItem: ''
        }
    },
    methods:{
        getProdcuts(){
            axios.get(`${url}/api/${path}/products/all`)
            .then(res=>{
                // console.log(res.data);
                this.cartProducts = res.data.products;
            })
            .catch(rej=>{
                console.log(rej);
            })
        },
       
        openProdcutModal(id){
            this.productId = id;
            this.$refs.productModal.openModal();
            //用Refs吃到元件內的dom，並利用其中的openmodal
        },
        getCart(){
            axios.get(`${url}/api/${path}/cart`)
            .then(res=>{
                console.log(res.data.data);
                this.cartsData = res.data.data ;
             
            })
            .catch(rej=>{
                console.log(rej);
            })
        },
        addToCart(id , qty=1){
            const data={
                product_id: id,
                qty
            }
            this.isloadingItem = id;
            // /v2/api/{api_path}/cart/{id} 
            axios.post(`${url}/api/${path}/cart`,{data})
            .then(res=>{
                console.log(res.data.data);
                this.getCart();
                this.isloadingItem="";
                this.$refs.productModal.closeModal();
            })
            .catch(rej=>{
                console.log(rej);
            })
        },
        removeCartItem(id){
            console.log(id);
            this.isloadingItem = id;
            axios.delete(`${url}/api/${path}/cart/${id}`)
            .then(res=>{
                console.log(res);
                this.getCart();
                this.isloadingItem = '';
            })
        },
        upDateToCart(item){
            const data={
                product_id: item.id,
                qty: item.qty

            }
            this.isloadingItem = item.id;
            // /v2/api/{api_path}/cart/{id} 
            console.log(item);
            axios.put(`${url}/api/${path}/cart/${item.id}`,{data})
            .then(res=>{
                console.log(res.data);
                this.getCart();
                this.isloadingItem="";
            })
            .catch(rej=>{
                console.log(rej);
            })
        },
        onSubmit() {
            console.log("表單送出");
          },
    },
    mounted(){
        this.getProdcuts();
        this.getCart();
    }
})

app.component('product-modal',{
    props: ['id'],
    data(){
        return{
            modal: '',
            tempProduct: {},
            qty: 1
        }
    },
    template: `#userProductModal`,
    watch: {
        //id 有改變就觸發
        id(){
            this.getProduct();
        }
    },
    methods:{
        openModal(){
            this.modal.show();
            // 將Modal打開
        },
        closeModal(){
            this.modal.hide();
          
        },
        getProduct(){
            axios.get(`${url}/api/${path}/product/${this.id}`)
            .then(res=>{
                console.log(res.data.product);
                this.tempProduct = res.data.product;
               
            })
            .catch(rej=>{
                console.log(rej);
            })
        },
        addToCart(){
            console.log(this.qty);
            this.$emit('add-cart',this.tempProduct.id, this.qty)
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
        //  bootstrap modal js 綁定
        }
})
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app')
