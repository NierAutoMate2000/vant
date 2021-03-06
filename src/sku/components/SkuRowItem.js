import { bem } from './SkuRow';
import { createNamespace } from '../../utils';
import { isSkuChoosable } from '../utils/sku-helper';
import { ChildrenMixin } from '../../mixins/relation';
import Image from '../../image';

const [createComponent] = createNamespace('sku-row-item');

export default createComponent({
  mixins: [ChildrenMixin('vanSkuRows')],

  props: {
    lazyLoad: Boolean,
    skuValue: Object,
    skuKeyStr: String,
    skuEventBus: Object,
    selectedSku: Object,
    largeImageMode: Boolean,
    skuList: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    imgUrl() {
      const url = this.skuValue.imgUrl || this.skuValue.img_url;
      return this.largeImageMode
        ? url ||
            'https://img.yzcdn.cn/upload_files/2020/06/24/FmKWDg0bN9rMcTp9ne8MXiQWGtLn.png'
        : url;
    },

    choosable() {
      return isSkuChoosable(this.skuList, this.selectedSku, {
        key: this.skuKeyStr,
        valueId: this.skuValue.id,
      });
    },
  },

  methods: {
    onSelect() {
      if (this.choosable) {
        this.skuEventBus.$emit('sku:select', {
          ...this.skuValue,
          skuKeyStr: this.skuKeyStr,
        });
      }
    },

    onPreviewImg(event) {
      event.stopPropagation();
      this.skuEventBus.$emit('sku:previewImage', this.imgUrl);
    },

    genImage(classPrefix) {
      if (this.imgUrl) {
        return (
          <Image
            fit="cover"
            src={this.imgUrl}
            class={`${classPrefix}-img`}
            lazyLoad={this.lazyLoad}
          />
        );
      }
    },
  },

  render() {
    const choosed = this.skuValue.id === this.selectedSku[this.skuKeyStr];
    const classPrefix = this.largeImageMode ? bem('image-item') : bem('item');

    return (
      <span
        class={[
          classPrefix,
          choosed ? `${classPrefix}--active` : '',
          !this.choosable ? `${classPrefix}--disabled` : '',
        ]}
        onClick={this.onSelect}
      >
        {this.genImage(classPrefix)}
        <div class={`${classPrefix}-name`}>
          {this.largeImageMode ? (
            <span class={{ 'van-multi-ellipsis--l2': this.largeImageMode }}>
              {this.skuValue.name}
            </span>
          ) : (
            this.skuValue.name
          )}
        </div>
        {this.largeImageMode && (
          <img
            class={`${classPrefix}-img-icon`}
            src="https://img.yzcdn.cn/upload_files/2020/06/29/Fi62E2HpMEGDDZS2-pd3LUOm_yWe.png"
            onClick={this.onPreviewImg}
          />
        )}
      </span>
    );
  },
});
